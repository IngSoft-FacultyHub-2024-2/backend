import fs from 'fs';
import {
  Body,
  Controller,
  Get,
  Middlewares,
  Patch,
  Path,
  Post,
  Query,
  Res,
  Route,
  Security,
  TsoaResponse,
} from 'tsoa';
import { isCoordinatorMiddleware } from '../middlewares/isCoordinatorMiddleware';
import { isTeacherOwnDataMiddleware } from '../middlewares/isTeacherOwnDataMiddleware';
import {
  addTeacher,
  dismissTeacher,
  getAllTeachersNames,
  getTeacherOwnData,
  getTeachers,
  getTeachersContacts,
  rehireTeacher,
  TeacherResponseDto,
  temporaryDismissTeacher,
  updateTeacher,
} from '../modules/teacher';
import { TeacherStates } from '../shared/utils/enums/teacherStates';
import inputTeacherSchema from './validationSchemas/teacherSchemas/inputTeacherSchema';
import inputTemporaryDismissSchema from './validationSchemas/teacherSchemas/inputTemporaryDismissSchema';

@Route('teachers')
export class TeacherController extends Controller {
  @Security('jwt')
  @Middlewares(isCoordinatorMiddleware)
  @Post('/')
  public async addTeacher(
    @Body() body: any,
    @Res() res: TsoaResponse<201, void>
  ) {
    await inputTeacherSchema.validate(body);
    await addTeacher(body);
    return res(201);
  }

  @Security('jwt')
  @Middlewares(isTeacherOwnDataMiddleware)
  @Get('/:id')
  public async getTeacherOwnData(
    @Path() id: number
  ): Promise<TeacherResponseDto> {
    return await getTeacherOwnData(id);
  }

  @Security('jwt')
  @Middlewares(isCoordinatorMiddleware)
  public async dismissTeacher(
    @Body() body: any,
    @Path() id: number,
    @Res() resp: TsoaResponse<204, void>
  ) {
    const teacherId = id;
    const motive = body.dismissMotive;

    await dismissTeacher(teacherId, motive);
    return resp(204);
  }

  @Security('jwt')
  @Middlewares(isCoordinatorMiddleware)
  @Patch('/:id/rehire')
  public async rehireTeacher(
    @Path() id: number,
    @Res() resp: TsoaResponse<204, void>
  ): Promise<void> {
    const teacherId = id;
    await rehireTeacher(teacherId);
    resp(204);
  }

  @Security('jwt')
  @Middlewares(isCoordinatorMiddleware)
  @Patch('/:id/temporary-dismiss')
  public async temporaryDismissTeacher(
    @Res() res: TsoaResponse<204, void>,
    @Res() errorResponse: TsoaResponse<500, { message: string }>,
    @Body() body: any,
    @Path() id: number
  ) {
    await inputTemporaryDismissSchema.validate(body);
    const teacherId = id;
    const retentionDate = body.retentionDate;
    const motive = body.dismissMotive;
    temporaryDismissTeacher(teacherId, retentionDate, motive);
  }

  @Security('jwt')
  @Middlewares(isCoordinatorMiddleware)
  @Get('/contacts')
  public async getTeachersContacts(
    @Res() res: TsoaResponse<200, void>,
    @Res() errorResponse: TsoaResponse<500, { message: string }>,
    @Res() notFoundResponse: TsoaResponse<404, { message: string }>,
    @Query() search?: string,
    @Query() state?: TeacherStates,
    @Query() unsubscribe_risk?: number,
    @Query() subject_id?: number
  ): Promise<void> {
    try {
      const teachersContactsFilePath = await getTeachersContacts(
        search,
        state,
        unsubscribe_risk,
        subject_id
      );

      if (!teachersContactsFilePath) {
        return notFoundResponse(404, {
          message: 'No se encontraron docentes con los filtros ingresados',
        });
      }

      res(200);
      res(200).download(
        teachersContactsFilePath,
        'contactos.csv',
        (err: any) => {
          if (err) {
            console.error('Error sending file:', err);
            return errorResponse(500, {
              message: 'Hubo un problema al enviar el archivo',
            });
          } else {
            fs.unlink(teachersContactsFilePath, (unlinkErr) => {
              if (unlinkErr) {
                console.error('Error deleting file:', unlinkErr);
              } else {
                console.log('File deleted successfully');
              }
            });
          }
        }
      );
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error:', error.message);
        return errorResponse(500, { message: error.message });
      }
    }
  }

  @Security('jwt')
  @Middlewares(isCoordinatorMiddleware)
  @Get('/')
  public async getTeachers(
    @Query() search?: string,
    @Query() state?: TeacherStates,
    @Query() unsubscribe_risk?: number,
    @Query() subject_id?: number,
    @Query() sortField?: string,
    @Query() sortOrder: 'ASC' | 'DESC' = 'ASC',
    @Query() page: number = 1,
    @Query() pageSize: number = 10,
    @Query() withDeleted?: boolean
  ): Promise<{
    teachers: TeacherResponseDto[];
    totalPages: number;
    currentPage: number;
  }> {
    const teachersResponse = await getTeachers(
      search,
      state,
      unsubscribe_risk,
      subject_id,
      sortField,
      sortOrder,
      page,
      pageSize,
      withDeleted
    );
    return teachersResponse;
  }

  @Security('jwt')
  @Get('/names')
  public async getAllTeachersNames() {
    return await getAllTeachersNames();
  }

  @Security('jwt')
  @Middlewares(isTeacherOwnDataMiddleware)
  @Patch('/:id')
  public async updateTeacher(@Body() body: any, @Path() id: number) {
    const teacherId = id;
    await inputTeacherSchema.validate(body);
    const teacher = await updateTeacher(teacherId, body);
    return teacher;
  }
}

export default new TeacherController();
