export class ConfigureError extends Error {
	constructor(message : string) {
		super(message);

		this.message = message;
		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);
	}
}