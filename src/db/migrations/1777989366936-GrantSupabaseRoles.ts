import { MigrationInterface, QueryRunner } from "typeorm";

export class GrantSupabaseRoles1777989366936 implements MigrationInterface {
  name = "GrantSupabaseRoles1777989366936";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Grant usage on the schema to all Supabase roles
    await queryRunner.query(`GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;`);

    // 2. Grant access to all existing tables
    await queryRunner.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;`);

    // 3. Grant access to all existing sequences
    await queryRunner.query(`GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;`);

    // 4. Set default privileges so future tables are also accessible
    await queryRunner.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO anon, authenticated, service_role;`);
    await queryRunner.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO anon, authenticated, service_role;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revoke privileges
    await queryRunner.query(`REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM anon, authenticated, service_role;`);
    await queryRunner.query(`REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated, service_role;`);
    await queryRunner.query(`REVOKE USAGE ON SCHEMA public FROM anon, authenticated, service_role;`);

    // Revoke default privileges
    await queryRunner.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL PRIVILEGES ON TABLES FROM anon, authenticated, service_role;`);
    await queryRunner.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL PRIVILEGES ON SEQUENCES FROM anon, authenticated, service_role;`);
  }
}
