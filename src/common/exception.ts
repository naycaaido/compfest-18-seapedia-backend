export const enum ExceptionType {
  NOT_FOUND = 'Not Found',
  BAD_REQUEST = 'Bad Request',
  UNAUTHORIZED = 'Unauthorized',
  FORBIDDEN = 'Forbidden',
  CONFLICT = 'Conflict',
  VALIDATION = 'Validation Failed',
  INTERNAL_SERVER_ERROR = 'Internal Server Error',
  DEFAULT =  'Cannot',
  EMPTY =  ''
}
export const exceptionMessage = (type: ExceptionType, value?: string) => {
    return value ? `${value} ${type}` : type;
};