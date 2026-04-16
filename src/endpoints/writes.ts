import {z} from 'zod';

import type {ExistClient} from '../client.js';
import type {ExistError} from '../client.js';
import type {
  AcquireOrReleaseItem,
  CreateAttributeItem,
  AttributeValueUpdate,
  AttributeIncrement,
} from '../types.js';

function validate<T>(schema: z.ZodSchema<T>, data: unknown, errorMessage: string): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const err: ExistError = {
      status: 0,
      message: errorMessage,
      cause: result.error.issues,
    };
    throw err;
  }
  return result.data;
}

const AcquireOrReleaseItemSchema = z.object({
  template: z.string().optional(),
  name: z.string().optional(),
  manual: z.boolean().optional(),
});

const CreateAttributeItemSchema = z.object({
  label: z.string().min(1),
  value_type: z.number().int().min(0).max(8),
  group: z.string().min(1),
  manual: z.boolean(),
});

const AttributeValueUpdateSchema = z.object({
  name: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  value: z.unknown(),
});

const AttributeIncrementSchema = z.object({
  name: z.string().min(1),
  value: z.unknown(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
});

export async function acquireAttributes(
  client: ExistClient,
  items: AcquireOrReleaseItem[],
): Promise<unknown> {
  const parsed = validate(
    z.array(AcquireOrReleaseItemSchema),
    items,
    'Invalid acquireAttributes input',
  );
  return client.post('/attributes/acquire/', {body: parsed});
}

export async function releaseAttributes(
  client: ExistClient,
  items: AcquireOrReleaseItem[],
): Promise<unknown> {
  const parsed = validate(
    z.array(AcquireOrReleaseItemSchema),
    items,
    'Invalid releaseAttributes input',
  );
  return client.post('/attributes/release/', {body: parsed});
}

export async function createAttributes(
  client: ExistClient,
  items: CreateAttributeItem[],
): Promise<unknown> {
  const parsed = validate(
    z.array(CreateAttributeItemSchema),
    items,
    'Invalid createAttributes input',
  );
  return client.post('/attributes/create/', {body: parsed});
}

export async function updateAttributeValues(
  client: ExistClient,
  items: AttributeValueUpdate[],
): Promise<unknown> {
  const parsed = validate(
    z.array(AttributeValueUpdateSchema),
    items,
    'Invalid updateAttributeValues input',
  );
  return client.post('/attributes/update/', {body: parsed});
}

export async function incrementAttributeValues(
  client: ExistClient,
  items: AttributeIncrement[],
): Promise<unknown> {
  const parsed = validate(
    z.array(AttributeIncrementSchema),
    items,
    'Invalid incrementAttributeValues input',
  );
  return client.post('/attributes/increment/', {body: parsed});
}
