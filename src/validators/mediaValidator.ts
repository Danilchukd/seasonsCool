import type {
  CreateMediaInput,
  UpdateMediaInput,
} from '../types/media';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function validateCreateMediaInput(
  input: unknown,
): CreateMediaInput {
  if (!isRecord(input)) {
    throw new Error('Media data must be an object');
  }

  const { title, type } = input;

  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('Media title cannot be empty');
  }

  if (typeof type !== 'string' || type.trim().length === 0) {
    throw new Error('Media type cannot be empty');
  }

  return {
    title: title.trim(),
    type: type.trim(),
  };
}

export function validateUpdateMediaInput(
  input: unknown,
): UpdateMediaInput {
  if (!isRecord(input)) {
    throw new Error('Media data must be an object');
  }

  const media = validateCreateMediaInput(input);
  const { id } = input;

  if (
    typeof id !== 'number' ||
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error('Media id must be a positive integer');
  }

  return {
    id,
    ...media,
  };
}

export function validateMediaId(id: unknown): number {
  if (
    typeof id !== 'number' ||
    !Number.isInteger(id) ||
    id <= 0
  ) {
    throw new Error('Media id must be a positive integer');
  }

  return id;
}