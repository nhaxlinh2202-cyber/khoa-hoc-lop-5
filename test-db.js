const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function testConnection() {
  try {
    // Read .env.local manually
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    let uri = '';
    const lines = envContent.split('\n');
    for (const line of lines) {
      if (line.startsWith('MONGODB_URI=')) {
        uri = line.replace('MONGODB_URI=', '').replace(/"/g, '').trim();
        break;
      }
    }

    if (!uri) {
      console.error('ERROR_DIAGNOSTIC: Không tìm thấy MONGODB_URI trong .env.local');
      return;
    }

    console.log('Đang thử kết nối tới:', uri.replace(/:([^:@]+)@/, ':***@')); // Hide password in log

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 seconds timeout
    });

    console.log('SUCCESS_DIAGNOSTIC: Kết nối MongoDB thành công hoàn toàn!');
    process.exit(0);
  } catch (error) {
    console.error('ERROR_DIAGNOSTIC:', error.message);
    if (error.name === 'MongoServerError' && error.code === 8000) {
      console.error('LÝ DO: Sai tên đăng nhập hoặc sai mật khẩu của MongoDB Atlas.');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('LÝ DO: Không thể kết nối tới máy chủ (Bị chặn hoặc IP chưa được cấp quyền).');
    }
    process.exit(1);
  }
}

testConnection();
