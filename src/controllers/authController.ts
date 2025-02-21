import { Body, Controller, Post, Route, Tags } from 'tsoa';
import { login } from '../modules/auth';
import { errorResolver } from '../shared/utils/exceptions/handleExceptions';
import inputLoginSchema from './validationSchemas/authSchemas/inputLoginSchema';

@Tags('Auth')
@Route('api/auth')
class AuthController extends Controller {
  @Post('/login')
  public async login(
    @Body() body: { teacher_employee_number: number; password: string }
  ) {
    try {
      await inputLoginSchema.validate(body);
      const { teacher_employee_number, password } = body;

      const result = await login(teacher_employee_number, password);

      return result;
    } catch (error) {
      if (error instanceof Error) {
        return errorResolver(error);
      }
    }
  }
}

export default new AuthController();
