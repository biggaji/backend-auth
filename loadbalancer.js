import cluster from 'node:cluster';
import os from 'node:os';
import path from 'node:path';

const numOfCpus = os.cpus().length;
console.log(numOfCpus);

const rootDir = process.cwd();

const indexFile = path.resolve(rootDir, 'index.js');

cluster.setupPrimary({
  exec: indexFile,
});

for (let i = 0; i < numOfCpus; i++) {
  cluster.fork();
}

cluster.on('exit', (worker, code, signal) => {
  console.log(`Server instance ${worker.process.id} has died`);
  cluster.fork();
});
