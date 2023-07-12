function locationObjectCreate(name, ulId, indexValue, hasClass) {
    const locationObject = {
      ulId: ulId,
      TodoName: name,
      columnIndex: indexValue,
      Class: hasClass
    };
    return locationObject;
}
  
function taskObjectCreate(name, ulId=null, status='active') {
const currentDate = new Date();
const taskObject = {
    id: generateRandomId(8),
    name: '',
    ulId: ulId,
    status: status,
    date: currentDate.toLocaleDateString(),
    // duedate: currentDate.toLocaleDateString(),
    //subTasks: [taskObjectCreate]
};
taskObject.name = name;
return taskObject;
}
  
function generateRandomId(length) {
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
let id = '';

for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
}

return id;
}
  
function getDate() {
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

var date = new Date();
var day = days[date.getDay()];
var month = months[date.getMonth()];
var dayOfMonth = date.getDate();
var year = date.getFullYear();

var formattedDate = day + ' ' + month + ' ' + dayOfMonth + ' ' + year;
return formattedDate;
}