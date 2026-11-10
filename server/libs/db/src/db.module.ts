import { Global, Module, type OnModuleInit } from '@nestjs/common';
import { DbService } from './db.service.js';
import { runMigrations } from './migrate.js';

@Global()
@Module({
  providers: [DbService],
  exports: [DbService],
})
export class DbModule implements OnModuleInit {
  async onModuleInit() {
    await runMigrations();
  }
}
