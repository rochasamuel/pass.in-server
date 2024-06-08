import { PrismaClient } from "@prisma/client";
import fastify from "fastify";
import { eventNames } from "process";
import z from 'zod';

const app = fastify();

const prisma = new PrismaClient({
  log: ['query']
})

app.post('/events', async (request, response) => {
  const createEventSchema = z.object({
    title: z.string().min(4),
    details: z.string().nullable(),
    maximumAttendees: z.number().int().positive().nullable(),
  });

  const data = createEventSchema.parse(request.body);
  
  const event = await prisma.event.create({
    data: {
      title: data.title,
      details: data.details,
      maximumAttendees: data.maximumAttendees,
      slug: data.title.toLowerCase().replace(' ', '-'),
    }
  })

  return response.status(201).send({ eventId: event.id });
})

app.listen({ port: 3333 }, (_, address) => {
  console.log(`Server listening at ${address}`);
});