import { PrismaClient } from '@prisma/client';
import { IdentifyRequest, IdentifyResponse } from '../types';

// Create a single PrismaClient instance and reuse it
const prisma = new PrismaClient();

export async function identifyContact(
  input: IdentifyRequest
): Promise<IdentifyResponse> {
  const { email, phoneNumber } = input;

  try {
    // Input validation
    if (!email && !phoneNumber) {
      throw new Error('At least one of email or phoneNumber is required');
    }

    // Find all contacts that match email or phoneNumber
    const matchingContacts = await prisma.contact.findMany({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phoneNumber ? [{ phoneNumber }] : []),
        ],
        deletedAt: null,
      },
    });

    console.log(`Found ${matchingContacts.length} matching contacts`);

    // If no matching contacts, create a new primary contact
    if (!matchingContacts.length) {
      console.log('Creating new primary contact');
      const newContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkPrecedence: 'primary',
        },
      });

      return {
        contact: {
          primaryContatctId: newContact.id,
          emails: newContact.email ? [newContact.email] : [],
          phoneNumbers: newContact.phoneNumber ? [newContact.phoneNumber] : [],
          secondaryContactIds: [],
        },
      };
    }

    // Find the primary contact
    let primaryContact = matchingContacts.find(
      (c) => c.linkPrecedence === 'primary'
    );
    
    if (!primaryContact) {
      // If no primary found, take the earliest contact
      primaryContact = matchingContacts.reduce((earliest, current) =>
        earliest.createdAt < current.createdAt ? earliest : current
      );
      console.log(`No primary contact found, using oldest contact (ID: ${primaryContact.id}) as primary`);
    } else {
      console.log(`Found primary contact with ID: ${primaryContact.id}`);
    }

    // Check if we need to create a new secondary contact
    const hasNewEmail = email && !matchingContacts.some((c) => c.email === email);
    const hasNewPhone = phoneNumber && !matchingContacts.some((c) => c.phoneNumber === phoneNumber);
    
    if (hasNewEmail || hasNewPhone) {
      console.log('Creating new secondary contact with new information');
      const newContact = await prisma.contact.create({
        data: {
          email,
          phoneNumber,
          linkedId: primaryContact.id,
          linkPrecedence: 'secondary',
        },
      });
      matchingContacts.push(newContact);
    }

    // Handle merging of contacts if email and phoneNumber connect two primary contacts
    const primaryContacts = matchingContacts.filter(
      (c) => c.linkPrecedence === 'primary'
    );
    
    if (primaryContacts.length > 1) {
      console.log(`Found ${primaryContacts.length} primary contacts, merging them`);
      const oldestPrimary = primaryContacts.reduce((oldest, current) =>
        oldest.createdAt < current.createdAt ? oldest : current
      );

      for (const contact of primaryContacts) {
        if (contact.id !== oldestPrimary.id) {
          console.log(`Converting contact ID ${contact.id} from primary to secondary`);
          await prisma.contact.update({
            where: { id: contact.id },
            data: {
              linkPrecedence: 'secondary',
              linkedId: oldestPrimary.id,
              updatedAt: new Date(),
            },
          });
        }
      }

      // Refresh matching contacts after updates
      console.log('Refreshing contacts list after merge');
      const refreshedContacts = await prisma.contact.findMany({
        where: {
          OR: [
            { id: oldestPrimary.id },
            { linkedId: oldestPrimary.id },
            ...(email ? [{ email }] : []),
            ...(phoneNumber ? [{ phoneNumber }] : []),
          ],
          deletedAt: null,
        },
      });
      
      // Replace the contents of matchingContacts with refreshedContacts
      matchingContacts.length = 0;
      matchingContacts.push(...refreshedContacts);
      primaryContact = oldestPrimary;
    }

    // Collect unique emails, phoneNumbers, and secondary IDs with proper type guards
    const emails = Array.from(
      new Set(matchingContacts.map((c) => c.email).filter(Boolean) as string[])
    );
    
    const phoneNumbers = Array.from(
      new Set(matchingContacts.map((c) => c.phoneNumber).filter(Boolean) as string[])
    );
    
    const secondaryContactIds = matchingContacts
      .filter((c) => c.id !== primaryContact.id)
      .map((c) => c.id);

    // Ensure primary contact's contact info is first in the arrays
    if (primaryContact.email && emails.includes(primaryContact.email)) {
      const index = emails.indexOf(primaryContact.email);
      if (index !== -1) {
        emails.splice(index, 1);
        emails.unshift(primaryContact.email);
      }
    }
    
    if (primaryContact.phoneNumber && phoneNumbers.includes(primaryContact.phoneNumber)) {
      const index = phoneNumbers.indexOf(primaryContact.phoneNumber);
      if (index !== -1) {
        phoneNumbers.splice(index, 1);
        phoneNumbers.unshift(primaryContact.phoneNumber);
      }
    }

    return {
      contact: {
        primaryContatctId: primaryContact.id,
        emails,
        phoneNumbers,
        secondaryContactIds,
      },
    };
  } catch (error) {
    console.error('Error in identifyContact:', error);
    throw error; // Re-throw to let the route handler handle it
  }
}