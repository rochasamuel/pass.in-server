import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { generateSlug } from "../utils/generate-slug";
import { prisma } from "../lib/prisma";
import { FastifyInstance } from "fastify";

export async function createEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/events",
    {
      schema: {
        body: z.object({
          title: z.string().min(4),
          details: z.string().nullable(),
          maximumAttendees: z.number().int().positive().nullable(),
        }),
        response: {
          201: z.object({
            eventId: z.string().uuid(),
          }),
        },
      },
    },
    async (request, response) => {
      const { title, details, maximumAttendees } = request.body;
  
      const slug = generateSlug(title);
  
      const existingSlug = await prisma.event.findFirst({
        where: {
          slug,
        },
      });
  
      if (existingSlug !== null) {
        throw new Error("There is already an event with this title.");
      }
  
      const event = await prisma.event.create({
        data: {
          title,
          details,
          maximumAttendees,
          slug,
        },
      });
  
      return response.status(201).send({ eventId: event.id });
    },
  );
}

