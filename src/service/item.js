let smallestTimestamp = null;
let largestTimestamp = null;
const PAGE_SIZE = 10;

async function queryRunner(postgres, dir, order = 'desc', limit = 10) {
  let result;

  // Filter and fetch rows with created_at > largestTimestamp when:
  // 1. we want to fetch the results for the next page in an ascending order, or
  // 2. we want to fetch the results for the previous page in a descending order
  if (dir && ((dir === 'next' && order === 'asc') || (dir === 'previous' && order === 'desc'))) {
    result = await postgres.query(`SELECT * FROM items WHERE created_at > '${largestTimestamp}' order by created_at asc limit ${PAGE_SIZE};`);
  }
  // Filter and fetch rows with created_at < largestTimestamp when:
  // 1. we want to fetch the results for the next page in a descending order, or
  // 2. we want to fetch the results for the previous page in an ascending order
  else if (dir && ((dir === 'next' && order === 'desc') || (dir === 'previous' && order === 'asc'))) {
    result = await postgres.query(`SELECT * FROM items WHERE created_at < '${smallestTimestamp}' order by created_at desc limit ${PAGE_SIZE};`);
  }
  // If direction (or, dir) is not provided, fetch the first page
  else {
    result = await postgres.query(`SELECT * FROM items order by created_at ${order} limit ${limit};`);
  }

  if (result && result.rows && result.rows.length === 0) return [];
  const rows = result.rows;

  // sort rows in the order that client expects
  rows.sort((a, b) => {
    if (new Date(a.created_at).toISOString() === new Date(b.created_at).toISOString()) {
      if (order === 'desc') return +b.id - +a.id;
      return +a.id - +b.id;
    }
    
    if (order === 'desc') return new Date(b.created_at) - new Date(a.created_at);
    return new Date(a.created_at) - new Date(b.created_at);
  });

  // Update largest and smallest timestamps from fetched data
  if (order === 'desc') {
    largestTimestamp = new Date(rows[0].created_at).toISOString();
    smallestTimestamp = new Date(rows[rows.length - 1].created_at).toISOString(); 
  }
  else {
    largestTimestamp = new Date(rows[rows.length - 1].created_at).toISOString();  
    smallestTimestamp = new Date(rows[0].created_at).toISOString();
  }

  return result.rows;
}

module.exports = ({ postgres }) => {
  async function create() {
    try {
      for (let i=10000; i<11000; i++) {
        // We are using Postgres' timestamp with time zone data type for the created_at field; the timestamp is precise upto microseconds
        // However, the Date().toISOString() has precision till milliseconds. Due to this, JS loses some precision and entries created close enough end up having (almost) same created_at
        // As a workaround, we're manually putting a 1 sec interval between every entry
        await new Promise(resolve => setTimeout(resolve, 1000));
        await postgres.query(`INSERT INTO items(name, description) values ('item${i}','description${i}');`);
      }
    }
    catch(err) {
      console.log('⚠️ err while creating items: ', err);
      return null;
    }
  }

  async function read({ dir, order = 'desc' }) {
    try {
      const rows = await queryRunner(postgres, dir, order, PAGE_SIZE);
      if (rows && rows.length === 0) return null;
      return rows;
    }
    catch (err) {
      console.log('⚠️ err while fetching items: ', err);
      return null;
    }
  }

  return {
    create,
    read,
  }
}