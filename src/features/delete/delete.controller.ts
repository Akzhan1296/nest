import { Controller, Delete, HttpCode } from '@nestjs/common';
import { DeleteService } from './delete.service';
@Controller('testing/all-data')
export class DeleteController {
  constructor(protected readonly deleteService: DeleteService) {}

  @Delete()
  @HttpCode(204)
  async deleteData() {
    return this.deleteService.deleteData();
  }
}
