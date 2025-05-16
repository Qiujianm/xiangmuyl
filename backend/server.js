const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('./config/db'); // 只需require一次，自动初始化

const app = express();

app.use(cors());
app.use(bodyParser.json());

// 路由
app.use('/api/token', require('./routes/token'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));