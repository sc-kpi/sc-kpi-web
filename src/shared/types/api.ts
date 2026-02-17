/**
 * RFC 9457 Problem Detail for HTTP APIs
 * @see https://www.rfc-editor.org/rfc/rfc9457
 */
export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  violations?: ValidationError[];
  [key: string]: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;
  readonly type: string;
  readonly detail?: string;
  readonly instance?: string;
  readonly violations?: ValidationError[];

  constructor(problem: ProblemDetail) {
    super(problem.title);
    this.name = "ApiError";
    this.status = problem.status;
    this.type = problem.type;
    this.detail = problem.detail;
    this.instance = problem.instance;
    this.violations = problem.violations;
  }

  get isValidationError(): boolean {
    return this.status === 422 && !!this.violations?.length;
  }

  get isUnauthorized(): boolean {
    return this.status === 401;
  }

  get isForbidden(): boolean {
    return this.status === 403;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isRateLimited(): boolean {
    return this.status === 429;
  }
}

export interface PaginatedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
