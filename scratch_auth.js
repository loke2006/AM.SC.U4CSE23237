const axios = require('axios');

async function getAuth() {
  try {
    const res = await axios.post('http://20.207.122.201/evaluation-service/auth', {
      email: "am.sc.u4cse23237@student.amrita.edu",
      name: "loki",
      rollNo: "am.sc.u4cse23237",
      accessCode: "PTBMmQ",
      clientID: "0acfe1cf-b076-4ef2-9e32-09f5eddfd044",
      clientSecret: "mNstURRmtHyDCtNY"
    });
    console.log("NEW_TOKEN=" + res.data.access_token);
  } catch (err) {
    console.error(err.response ? err.response.data : err.message);
  }
}

getAuth();
