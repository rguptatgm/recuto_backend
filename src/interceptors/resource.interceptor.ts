import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ProjectService } from 'src/api/project/services/project.service';

// ResourceInterceptor
// if resource is given gets the project and add it to the user object in the given request

@Injectable()
export class ResourceInterceptor implements NestInterceptor {
  constructor(private readonly projectService: ProjectService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const { resource } = context.switchToHttp().getRequest().headers;

    if (resource != null && context.switchToHttp().getRequest()?.user != null) {
      const project = await this.projectService.findOne({
        conditions: { _id: resource },
      });

      if (project != null) {
        context.switchToHttp().getRequest().project = project;
      }
    }

    return next.handle();
  }
}
