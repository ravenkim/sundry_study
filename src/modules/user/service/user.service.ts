// import { Injectable } from '@nestjs/common';
// import { DatabaseService } from '../database/database.service';
// import * as fs from 'fs';
// import * as path from 'path';
//
// @Injectable()
// export class UserService {
//   constructor(private readonly databaseService: DatabaseService) {}
//
//   async executeSqlFromFile(filePath: string) {
//     const fullPath = path.resolve(__dirname, filePath);
//     const sql = fs.readFileSync(fullPath, 'utf8');
//     return this.databaseService.query(sql);
//   }
// }