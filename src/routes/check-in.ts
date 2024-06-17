import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function checkIn(app: FastifyInstance) {
  app
    .withTypeProvider<ZodTypeProvider>()
    .get('/attendees/:attendeeId/checkin', {
      schema: {
        params: z.object({
          attendeeId: z.coerce.number().int().positive(),
        }),
        response: {
          201: z.null(),
        },
      },
    } , async (request, response) => {
      const { attendeeId } = request.params;

      const attendeeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attendeeId,
        },
      });

      if(attendeeCheckIn !== null) {
        throw new Error("Attendee already checked in.");
      }

      await prisma.checkIn.create({
        data: {
          attendeeId,
        },
      });

      response.status(201).send();
    });
}