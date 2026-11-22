import type { Season } from '../types/media';
import type {
  CreateSeasonPlanInput,
  SeasonPlanQuery,
  UpdateSeasonPlanInput,
} from '../types/seasonPlan';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function validateSeason(value: unknown): Season {
  if (
    value !== 'winter' &&
    value !== 'spring' &&
    value !== 'summer' &&
    value !== 'autumn'
  ) {
    throw new Error('Invalid season');
  }

  return value;
}

function validateSeasonYear(value: unknown): number {
  if (
    typeof value !== 'number' ||
    !Number.isInteger(value) ||
    value < 1 ||
    value > 9998
  ) {
    throw new Error('Season year must be an integer between 1 and 9998');
  }

  return value;
}

function validateTitle(value: unknown): string {
  if (typeof value !== 'string') {
    throw new Error('Plan title must be a string');
  }

  const title = value.trim();

  if (title.length === 0 || title.length > 200) {
    throw new Error('Plan title must have 1 to 200 characters');
  }

  return title;
}

export function validateSeasonPlanId(value: unknown): number {
  if (
    typeof value !== 'number' ||
    !Number.isSafeInteger(value) ||
    value <= 0
  ) {
    throw new Error('Invalid season plan id');
  }

  return value;
}

export function validateSeasonPlanQuery(input: unknown): SeasonPlanQuery {
  if (!isRecord(input)) {
    throw new Error('Season plan query must be an object');
  }

  return {
    season: validateSeason(input.season),
    seasonYear: validateSeasonYear(input.seasonYear),
  };
}

export function validateCreateSeasonPlanInput(
  input: unknown,
): CreateSeasonPlanInput {
  if (!isRecord(input)) {
    throw new Error('Season plan must be an object');
  }

  const { season, seasonYear } = validateSeasonPlanQuery(input);
  const mediaId = input.mediaId === null || input.mediaId === undefined
    ? null
    : validateSeasonPlanId(input.mediaId);

  return {
    season,
    seasonYear,
    title: validateTitle(input.title),
    mediaId,
  };
}

export function validateUpdateSeasonPlanInput(
  input: unknown,
): UpdateSeasonPlanInput {
  if (!isRecord(input)) {
    throw new Error('Season plan update must be an object');
  }

  if (typeof input.completed !== 'boolean') {
    throw new Error('Plan completed must be a boolean');
  }

  return {
    id: validateSeasonPlanId(input.id),
    title: validateTitle(input.title),
    completed: input.completed,
  };
}
