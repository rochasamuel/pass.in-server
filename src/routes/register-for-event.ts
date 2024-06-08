import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function registerForEvent(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .post("/events/:eventId/attendees", {
      schema: {
        body: z.object({
          name: z.string(),
          email: z.string().email(),
        }),
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          201: z.object({
            attendeeId: z.number(),
          }),
          409: z.object({
            message: z.string(),
          }),
        }
      }
    }, async (request, response) => {
      
      const { eventId } = request.params;
      const { name, email } = request.body;

      const attendeeFromEmail = await prisma.attendee.findUnique({
        where: {
          eventId_email: {
            email,
            eventId
          }
        }
      })

      if (attendeeFromEmail !== null) {
        throw new Error("This e-mail already registered for this event.");
      }

      const event = await prisma.event.findUnique({
        select: {
          maximumAttendees: true,
          _count: {
            select: {
              attendees: true
            }
          }
        },
        where: {
          id: eventId
        }
      })

      if (event === null) {
        throw new Error("Event not found.");
      }

      const attendeesCountForEvent = event._count.attendees;

      if (event?.maximumAttendees && (attendeesCountForEvent >= event.maximumAttendees)) {
        throw new Error("The maximum number of attendees for this event has been reached.");
      }

      const attendee = await prisma.attendee.create({
        data: {
          name,
          email,
          eventId
        }
      })

      return response.status(201).send({ attendeeId: attendee.id });
    })
}