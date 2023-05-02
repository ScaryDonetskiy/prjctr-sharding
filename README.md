Database: Sharding
=

Setup
-
1. Run ```docker-compose up```
2. For vertical sharding execute commands from ```vertical_sharding.sql``` on first pg server
3. For horizontal sharding execute commands from ```horizontal_sharding_shard_server_2.sql``` and similar file 
for 3rd server on 2nd and 3rd servers (shard servers). And execute commands from ```horizontal_sharding_main_server``` 
on first pg server.
4. Run ```node load.js``` for inserting 1'000'000 random rows. Also you can use ```books.sql``` dataset, but you after 
inserts you need to alter sequence using command ```ALTER SEQUENCE id_seq RESTART WITH 1000001;```
5. Run ```node benchmark.js``` for benchmark

Benchmark scenario
-
1. Select 1 book by id
2. Select 1 book from random category
3. Select 30 books by selected year
4. Insert 1 book
5. Insert 10 books in random categories
6. Update 1 book by id
7. Update books by selected year
8. Delete 1 book
9. Delete books by selected year

Results
-
| Type/Step           | 1                   | 2                      | 3                     | 4                      | 5                      | 6                  | 7                 | 8                  | 9                 |
|---------------------|---------------------|------------------------|-----------------------|------------------------|------------------------|--------------------|-------------------|--------------------|-------------------|
| No Sharding         | **5.3836659938097** | 1.4935000091791153     | 167.55354200303555    | **3.1960829943418503** | **1.7689169943332672** | 2.0137919932603836 | 42.4203340113163  | 1.2789169996976852 | 43.36199998855591 |
| Vertical Sharding   | 100.0696670114994   | **1.2184579968452454** | **42.69129200279713** | 6.195374995470047      | 3.7150840014219284     | 31.474458009004593 | 44.68062499165535 | 32.03429099917412  | 44.00074999034405 |
| Horizontal Sharding | 61.3503750115633    | 3.3061250001192093     | 146.3517500013113     | 6.040917009115219      | 5.1438339948654175     |                    |                   |                    |                   |