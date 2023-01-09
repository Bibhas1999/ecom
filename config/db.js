import mongoose from 'mongoose';
import dotenv from 'dotenv'
dotenv.config()
const db_name = process.env.DB_NAME
const db_port = process.env.DB_PORT
const db_user = process.env.DB_USER
const db_pass = process.env.DB_PASS
const db_cluster0=process.env.DB_CLUSTER_0
const db_cluster1=process.env.DB_CLUSTER_1
const db_cluster2=process.env.DB_CLUSTER_2
const db_replica_set = process.env.DB_REPLICA_SET
const db_ssl = process.env.DB_SSL
const db_prefix = process.env.DB_URL_PREFIX

// const db_url = `${db_prefix}://${db_user}:${db_pass}@${db_cluster0}:${db_port},${db_cluster1}:${db_port},${db_cluster2}:${db_port}/${db_name}?replicaSet=${db_replica_set}&ssl=${db_ssl}&authSource=admin`
const db_url = 'mongodb://127.0.0.1/db_api'
mongoose.connect(db_url, { useNewUrlParser: true,useUnifiedTopology: true }, (err) => {
  if (!err) {
    console.log('MongoDB connected successfully');
  } else {
    console.error('ERR_DB_CONNECT : ' + err);
  }
});
export default db_url