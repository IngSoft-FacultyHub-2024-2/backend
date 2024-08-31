import { getEvents, addEvent } from './modules/subject';

export async function initializeDatabase() {
  try {
      // Check if events already exist
      const existingEvents = await getEvents({title: "Obligatorio1"});

      // If not, create two new events
      if (existingEvents.length === 0) {
      await addEvent({ title: 'Obligatorio1' });
      await addEvent({ title: 'Obligatorio2' });
      await addEvent({ title: 'Parcial1' });
      await addEvent({ title: 'Parcial2' });
      console.log('Initialization events created successfully.');
      } else {
      console.log('Initialization events already exist.');
      }
  } catch (error) {
      console.error('Error initializing events:', error);
  }
};

  
