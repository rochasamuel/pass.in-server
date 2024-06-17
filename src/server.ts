import fastify from "fastify";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import {
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler
} from "fastify-type-provider-zod";
import { createEvent } from "./routes/create-event";
import { getEvent } from "./routes/get-event";
import { registerForEvent } from "./routes/register-for-event";
import { getAttendeeBadge } from "./routes/get-attendee-badge";
import { checkIn } from "./routes/check-in";
import { getEventAttendees } from "./routes/get-event-attendees";

const app = fastify();

app.register(
	fastifySwagger, {
		swagger: {
			consumes: ["application/json"],
			produces: ["application/json"],
			info: {
				title: "pass.in",
				description: "especificação da API pass.in construida no NLW Unite",
				version: "1.0.0"
			},
		},
		transform: jsonSchemaTransform
	}
)

app.register(fastifySwaggerUI, {
	routePrefix: "/docs",
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createEvent);
app.register(registerForEvent);
app.register(getEvent);
app.register(getAttendeeBadge);
app.register(checkIn);
app.register(getEventAttendees);

app.listen({ port: 3333 }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}	
	console.log(`Server listening at ${address}`);
});
