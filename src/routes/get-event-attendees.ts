import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../lib/prisma";

export async function getEventAttendees(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().get(
		"/events/:eventId/attendees",
		{
			schema: {
				summary: "Get event attendees by event ID",
        tags: ["events"],
				params: z.object({
					eventId: z.string().uuid(),
				}),
				querystring: z.object({
					query: z.string().nullish(),
					page: z.string().nullish().default("0").transform(Number),
				}),
				response: {
          200: z.object({
            attendees: z.array(
              z.object({
                id: z.number(),
                name: z.string(),
                email: z.string().email(),
                createdAt: z.date(),
                checkedInAt: z.date().nullable(),
              })
            ),
          })
        },
			},
		},
		async (request, response) => {
			const { eventId } = request.params;
			const { page, query } = request.query;

			const eventAttendees = await prisma.attendee.findMany({
				select: {
					id: true,
					name: true,
					email: true,
					createdAt: true,
					checkIn: {
						select: {
							createdAt: true,
						},
					},
				},
				where: query
					? { eventId, name: { contains: query } }
					: {
							eventId,
					  },
				take: 10, //this value can come from the querystring too
				skip: page * 10,
        orderBy: {
          createdAt: "desc",
        }
			});

			response.status(200).send({
				attendees: eventAttendees.map((attendee) => ({
					id: attendee.id,
					name: attendee.name,
					email: attendee.email,
					createdAt: attendee.createdAt,
					checkedInAt: attendee.checkIn?.createdAt ?? null,
				})),
			});
		},
	);
}
