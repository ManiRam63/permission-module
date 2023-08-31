import { createClient } from 'redis';
export default createClient({
  password: 'tGdj3FLD7dfDQyuWoG63WNHI8fCC5tyW',
  socket: {
    host: 'redis-12971.c309.us-east-2-1.ec2.cloud.redislabs.com',
    port: 12971,
  },
});
