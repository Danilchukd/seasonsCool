import type {
  CreateMediaInput,
  UpdateMediaInput,
} from '../types/media';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function validateYear(value: unknown): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value <= 0
  ) {
    throw new Error('Media year must be a positive integer');
  }

  return value;
}

function validateDescription(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error('Media description must be a string');
  }

  const description = value.trim();

  return description.length > 0 ? description : null;
}

export function validateCreateMediaInput(
  input: unknown,
): CreateMediaInput {
  if (!isRecord(input)) {
    throw new Error('Media data must be an object');
  }

  const {
    title,
    type,
    year,
    description,
    filePath,
  } = input;

  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new Error('Media title cannot be empty');
  }

  if (typeof type !== 'string' || type.trim().length === 0) {
    throw new Error('Media type cannot be empty');
  }

  return {
    title: title.trim(),
    type: type.trim(),
    year: validateYear(year),
    description: validateDescription(description),
    filePath: validateFilePath(filePath),
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

function validateFilePath(
  value: unknown,
): string | null {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value !== 'string') {
    throw new Error('Media file path must be a string');
  }

  const filePath = value.trim();

  return filePath.length > 0 ? filePath : null;
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