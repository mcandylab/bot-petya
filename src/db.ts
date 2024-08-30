import {neon, NeonQueryFunction} from '@neondatabase/serverless';
import {drizzle, NeonHttpDatabase} from 'drizzle-orm/neon-http';

class DB {
    private static instance: DB | null = null;
    public connection: NeonQueryFunction<false, false>;
    public db: NeonHttpDatabase

    private constructor() {
        this.connection = neon(process.env.DRIZZLE_DATABASE_URL!);
        this.db = drizzle(this.connection);
    }

    public static getInstance(): DB {
        if (!DB.instance) {
            DB.instance = new DB();
        }
        return DB.instance;
    }
}

export default DB;
