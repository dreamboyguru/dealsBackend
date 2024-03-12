const express = require('express');
const mongoose = require('mongoose')
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const { EmployeesModel, LoginModel } = require('./model/User');
const router = express.Router();

require('dotenv').config();
const port = process.env.port || 3001;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// mongoose.connect('mongodb://127.0.0.1:27017/crud');
mongoose.connect(process.env.dburl)


// Middleware
// app.use(bodyParser.json());

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    LoginModel.findOne({ email })
    .then(admin => {
        if ('121212' === password && email === 'admin@gmail.com') {
            res.send(email);
        } else {
            res.send('not found');
        }
    })
    .catch(err => {
        console.log('Error:', err);
    });
});


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

app.post('/upload', upload.single('image'), (req, res) => {
    const email = req.body.email;

    EmployeesModel.findOne({ email: email })
    .then(employee => {
        if (employee) {
            res.send('Employee found');
        } else {
            EmployeesModel.create({ 
                ...req.body, 
                date: new Date().toISOString().slice(0, 10), 
                image: req.file.filename 
            })
            .then(result => res.json(result))
            .catch(err => console.log(err));
        }
    })
    .catch(err => {
        console.error('Error:', err);
    });
    // console.log(req.body);

});

app.get('/employees', (req, res) => {
    EmployeesModel.find()
      .then(result => res.json(result))
      .catch(err => console.log(err));
})

app.delete('/employees/:email', (req, res) => {
    const email = req.params.email;
    EmployeesModel.deleteOne({email})
        .then(result => res.json(result))
        .catch(err => console.log(err))
})


app.put('/employees/:id', async (req, res) => {
    const { id } = req.params; // Destructure email directly
    const { name, email,  phone, designation, gender, course, image } = req.body;

    try {
        // Find the employee by email and update their data
        const updatedEmployee = await EmployeesModel.findOneAndUpdate({ email }, {
            name,
            email,
            phone,
            designation,
            gender,
            course,
            image
        }, { new: true }); // Set { new: true } to return the updated document

        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json(updatedEmployee);
    } catch (error) {
        console.error('Error updating employee:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.listen(port, () => {
    console.log(`App is listening on http://localhost:${port}`);
});
