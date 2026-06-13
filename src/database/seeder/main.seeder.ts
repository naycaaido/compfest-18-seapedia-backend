import { DataSource, DataSourceOptions } from 'typeorm';
import { runSeeders, Seeder, SeederOptions } from 'typeorm-extension';
import { options } from '../../config/db.config';


(async () => {
    const dataSource = new DataSource(options);
    await dataSource.initialize();
    await runSeeders(dataSource,{
        seeds:[
            // UserSeeder
        ]
    });
})();