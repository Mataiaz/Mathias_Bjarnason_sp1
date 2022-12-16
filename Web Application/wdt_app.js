//variables that holds the id's of elements
const scheduleTable = document.getElementById("scheduleTable");
const deliveryTable = document.getElementById("deliveryTable");
const staffTable = document.getElementById("staffTable");
const staffTbody = document.getElementById("staffTable").querySelector(".staff-body");
//Arrays that holds the staff/delivery objects
const staff = [];
const deliveries = [];
//Here we run the startup functions
(async function Load() {
    console.log(scheduleTable);
    await staffUserGet(5);
    new Time().digitalClock();
})();
//Initial API request for populating the the staff table
async function staffUserGet(amount) {
    const items = [];
    while (amount > 0) {
        amount--;
        await fetch('https://randomuser.me/api/')
            .then((response) => response.json())
            .then((response) => items[amount] = response)
            .finally((items) => { return items });
    }
    items.forEach((item) => {
        staff.push(new StaffMember(item.results[0].name.first, item.results[0].name.last, item.results[0].picture.thumbnail, item.results[0].email, 'In'));
    })
    await loadTableData();
    return items;
}
//Populate table with data from the api request
async function loadTableData() {
    let i = staff.length;
    if (staffTbody.children.length > 1) {
    while (i > 0) {
        staffTbody.children[i].innerHTML = "";
        i--
    }
}
    staff.forEach((item) => {
        let row = staffTbody.insertRow();
        let picture = row.insertCell(0);
        picture.innerHTML = '<img src="' + item.picture + '" />';
        let name = row.insertCell(1);
        name.innerHTML = item.getName();
        let surName = row.insertCell(2);
        surName.innerHTML = item.getSurname();
        let email = row.insertCell(3);
        email.innerHTML = item.email;
        let status = row.insertCell(4);
        status.innerHTML = item.status;
        let outTime = row.insertCell(5);
        let duration = row.insertCell(6);
        let returnTime = row.insertCell(7);
        //item.results[0].name.last;
        console.log(staff)
    });
}
function staffIn() {
    const marked = document.getElementsByClassName("marked");
    let i = staff.length -1;
    while(i > -1) {
        if ($(marked).find('td:eq(3)').html() == staff[i].email)
        {
            break
        }
        i--;
    }
    let rows = Array.from(document.querySelectorAll('tr:not(:first-child)'));
    staff[i].status = 'In';
    staff[i].outTime = '';
    staff[i].duration = '';
    staff[i].expectedReturnTime = '';
    $(marked).find('td:eq(4)').html(staff[i].status);
    $(marked).find('td:eq(5)').html(staff[i].outTime);
    $(marked).find('td:eq(6)').html(staff[i].duration);
    $(marked).find('td:eq(7)').html(staff[i].expectedReturnTime);
    rows.forEach(node => {
        node.classList.remove('marked');
      });
}
function staffOut() {
    const marked = document.getElementsByClassName("marked");
    let i = staff.length -1;
    while(i > -1) {
        if ($(marked).find('td:eq(3)').html() == staff[i].email)
        {
            break
        }
        i--;
    }
    let rows = Array.from(document.querySelectorAll('tr:not(:first-child)'));
    var time = prompt("Please enter a time");
    var d = new Date();
    var hour = d.getHours();
    var min = d.getMinutes();
    var milliseconds = time * 60000;
    var hours = Math.floor(time / 60);  
    var minutes = time % 60;
    console.log(staff.length);
    if(!Number.isNaN(time) && time.length < 5 && time.length > 0 && /^\d+$/.test(time))
    {
        if(hour < 10) {
            hour = '0'+hour;
        }
        if(min < 10) {
            min = '0'+min;
        }
        staff[i].status = 'Out';
        staff[i].outTime = hour + ":" + min;
        hour = d.getHours();
        min = d.getMinutes();
        hour += hours;
        min += minutes;
        if(hour < 10) {
            hour = '0'+hour;
        }
        if(min < 10) {
            min = '0'+min;
        }
        staff[i].duration = hours + "hrs " + minutes + "min";
        staff[i].expectedReturnTime = hour + ":" + min;
        $(marked).find('td:eq(4)').html(staff[i].status);
        $(marked).find('td:eq(5)').html(staff[i].outTime);
        $(marked).find('td:eq(6)').html(staff[i].duration);
        $(marked).find('td:eq(7)').html(staff[i].expectedReturnTime);
        setTimeout(() => {staff[i].staffMemberIsLate()}, milliseconds);
    }
    else {
        alert("Invalid time")
    }
    rows.forEach(node => {
        node.classList.remove('marked');
      });
}
function addDelivery() {
    const order = [];
        validateDelivery(order);
        if (order.length == 6) {
            deliveries.push(new DeliveryDriver(order[0], order[1], order[2], order[3], order[4], order[5]));
            if(deliveries[deliveries.length -1].vehicle == "Car" || deliveries[deliveries.length -1].vehicle == "car" || deliveries[deliveries.length -1].vehicle == "CAR") {
                deliveries[deliveries.length -1].vehicle = "bi bi-car-front-fill";
            }
            if(deliveries[deliveries.length -1].vehicle == "Motorcycle" || deliveries[deliveries.length -1].vehicle == "motorcycle" || deliveries[deliveries.length -1].vehicle == "MOTORCYCLE") {
                deliveries[deliveries.length -1].vehicle = "bi bi-bicycle";
            }
            let row = deliveryTable.insertRow();
            let vehicle = row.insertCell(0);
            vehicle.innerHTML = '<i class="' + deliveries[deliveries.length -1].vehicle + '"></i>';
            deliveries[deliveries.length -1].vehicle = vehicle.innerHTML;
            let name = row.insertCell(1);
            name.innerHTML = deliveries[deliveries.length -1].getName();
            let surName = row.insertCell(2);
            surName.innerHTML = deliveries[deliveries.length -1].getSurname();
            let telephone = row.insertCell(3);
            telephone.innerHTML = deliveries[deliveries.length -1].telephone;
            let deliveryAddress = row.insertCell(4);
            deliveryAddress.innerHTML = deliveries[deliveries.length -1].deliveryAddress;
            let returnTime = row.insertCell(5);
            returnTime.innerHTML = deliveries[deliveries.length -1].returnTime.slice(0, 2) + ":" + deliveries[deliveries.length -1].returnTime.slice(2);
            deliveries[deliveries.length -1].returnTime = returnTime.innerHTML;
            let i = order.length -1;
            while (i > -1) {
                $(scheduleTable.getElementsByTagName("input")[i].value = "");
                i--;
            }
        }
        var d = new Date();
        var hour = d.getHours();
        var min = d.getMinutes();
        var time = hour - deliveries[deliveries.length -1].returnTime.slice(0, 2);
        time = time * 60;
        time = min - deliveries[deliveries.length -1].returnTime.slice(2);
        var milliseconds = time * 60000;
        setTimeout(() => {deliveries[deliveries.length -1].deliveryDriverIsLate()}, milliseconds);
}
function validateDelivery(order) {
    let i = 0;
    while (i < 6) {
        var vehicle = scheduleTable.getElementsByTagName("input")[0].value;
        var input = scheduleTable.getElementsByTagName("input");
        if (input[i].value.length < 1) {
            alert("You are missing a field");
            break;
        }
        if (vehicle === "Motorcycle" || vehicle === "motorcycle" || vehicle === "MOTORCYCLE"
        || vehicle === "Car" || vehicle === "car" || vehicle === "CAR") {
        }
        else {
            alert("Please type in Car or Motorcycle");
            break;
        }
        if (input[i].value.length > 99) {
            alert("The fields have a text limit of 100");
            break;
        }
        if (input[3].value.length > 15 || input[3].value.length < 7) {
            alert("Not a valid phone number");
            break;
        }
        if (input[5].value.length != 4) {
            alert("You must have four digits under return time");
            break;
        }
        order[i] = input[i].value;
        i++;
    }
    if (i == 6) {
        return order;
    }
}
//method for checking order and populating delivery board
$('#addBtn').on('click', () => {
    addDelivery();
})
//Employee
class Employee {
    name;
    surName;
    constructor (name, surName) {
        this.name = name;
        this.surName = surName;
    }
    //Get the employee names
    getName() {
        return this.name;
    }
    getSurname() {
        return this.surName;
    }
}
//Staff member 
class StaffMember extends Employee {
    picture;
    email;
    status;
    outTime;
    duration;
    expectedReturnTime;
    constructor (name, surName, picture, email, status)
    {
        super(name, surName);
        this.name = name;
        this.surName = surName;
        this.picture = picture;
        this.email = email;
        this.status = status;
    }
    //Get the staff members info
    getStaffMember() {
        Employ.getEmployNames;
    }
    //Notify user if staff member is late with toast
    staffMemberIsLate() {
        if(this.expectedReturnTime == new Time().getTime()) {
            createStaffToast(this.picture, this.getName(), this.getSurname(), this.duration);
        }
    }
}
//Delivery driver
class DeliveryDriver extends Employee {
    vehicle;
    telephone;
    deliveryAddress;
    returnTime;
    constructor (vehicle, name, surName, telephone, deliveryAddress, returnTime)
    {
        super(name, surName);
        this.name = name;
        this.surName = surName;
        this.vehicle = vehicle;
        this.telephone = telephone;
        this.deliveryAddress = deliveryAddress;
        this.returnTime = returnTime;
    }
    //Notify user if delivery driver is late with toast
    deliveryDriverIsLate() {
        //toast should display name, surname, telephone, estamated return time and address
        if(this.returnTime == new Time().getTime()) {
            createDriverToast(this.getName(), this.getSurname(), this.telephone, this.deliveryAddress, this.returnTime);
        }
    }
}
//date and clock
class Time {
    digitalClock() {
        var d = new Date();
        var day = d.getDate();
        var month = d.getMonth() + 1;
        var year = d.getFullYear();
        var hour = d.getHours();
        var min = d.getMinutes();
        var sec = d.getSeconds();
        if (hour < 10){
            hour = '0'+hour;
        }
        if (min < 10){
            min = '0'+min;
        }
        if (sec < 10){
            sec = '0'+sec;
        }
        document.getElementById("clock").innerHTML = day + " " + month +" "+ year + " " + hour + ":" + min + ":" + sec;
        setInterval(this.digitalClock, 1000);
    }
    getTime() {
        var d = new Date();
        var hour = d.getHours();
        var min = d.getMinutes();
        if (hour < 10){
            hour = '0'+hour;
        }
        if (min < 10){
            min = '0'+min;
        }
        return hour + ":" + min;
    }
}
//method for selecting order
$('#deliveryTable').on('click', 'tr:not(:first-child)', function(){
    let rows = Array.from(document.querySelectorAll('tr:not(:first-child)'));
    rows.forEach(node => {
        node.classList.remove('toDelete');
      });
    $(this).addClass("toDelete");
});
//Selecting a delivery order and then clicking clear will clear that order
$('#clearBtn').on('click', () => {
    const toDelete = document.getElementsByClassName("toDelete");
    let rows = Array.from(document.querySelectorAll('#deliveryTable tr:not(:first-child)'));
    let i = deliveries.length -1;
    if (confirm("Are you sure you want to delete this delivery order?")){
        while(i > -1) {
            if ($(toDelete).find(`td:eq(0)`).html() == deliveries[i].vehicle)
            {
                if ($(toDelete).find(`td:eq(1)`).html() == deliveries[i].getName())
                {
                    if ($(toDelete).find(`td:eq(2)`).html() == deliveries[i].getSurname())
                    {
                        if ($(toDelete).find(`td:eq(3)`).html() == deliveries[i].telephone)
                        {
                            if ($(toDelete).find(`td:eq(4)`).html() == deliveries[i].deliveryAddress)
                            {
                                if ($(toDelete).find(`td:eq(5)`).html() == deliveries[i].returnTime)
                                {
                                    deliveries.splice(i, 1)
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            i--;
        }
        $(toDelete).remove();
    }
    rows.forEach(node => {
        node.classList.remove('marked');
      });
})
//method for selecting a employee
$('#staffTable').on('click', '.staff-body tr', function(){
    let rows = Array.from(document.querySelectorAll('tr'));
    rows.forEach(node => {
        node.classList.remove('marked');
      });
    $(this).addClass("marked");
});
//Clicking the in button will update the employee's status
$('#inBtn').on('click', () => {
    staffIn();
})
//Clicking the out button will prompt the user for length in minutes and update the employee's status
$('#outBtn').on('click', () => {
    staffOut();
})
//Hover to show submenu of navigation bar
var change = 0;
$('.navBar').hover(() => {
    if (change == 0) {
        $('.dropMenu').show();
        change++;
    }
    else {
        change = 0;
        $('.dropMenu').hide();
    }
});
//Close toast
$('#toast-container').on('click', '.btn-close', (event) => {
    $(event.target).closest('.toast-warning').remove();
});
//Clicking on the navigation menu dashboard item will redirect you to the page you already on
$('.dashboard-item').on('click', () => {
    window.location.href = "index.html";
});
function createStaffToast(picture, name, surName, duration) {
    let container;
    //If container doesn't already exist create one
    if (!document.querySelector("#toast-container")) {
      container = document.createElement("div")
      container.setAttribute("id", "toast-container");
      document.body.appendChild(container);
    } else {
      // If container exists assign it to a variable
      container = document.querySelector("#toast-container");
    }
    let toast = `<div class="toast-warning">
    <div class="toast-header">
      <div class="toast-title">
      <img src="${picture}"/>
      <button type="button" class="btn-close" data-bs-dismiss="toast-warning" aria-label="Close"></button>
      <p>Employee: ${name} ${surName}</p>
      </div>
    </div>
    <div class="toast-body">
    <p>Total time out: ${duration}</p>
    </div>`;
    container.innerHTML += toast;
}
function createDriverToast(name, surName, telephone, deliveryAddress, returnTime) {
    let container;
    //If container doesn't already exist create one
    if (!document.querySelector("#toast-container")) {
      container = document.createElement("div")
      container.setAttribute("id", "toast-container");
      document.body.appendChild(container);
    } else {
      // If container exists assign it to a variable
      container = document.querySelector("#toast-container");
    }
    let toast = `<div class="toast-warning">
    <div class="toast-header">
      <div class="toast-title">
      <button type="button" class="btn-close" data-bs-dismiss="toast-warning" aria-label="Close"></button>
      <p>Delivery reminder</p>
      <p>Driver: ${name} ${surName}</p>
      <p>Phone: ${telephone}</p>
      </div>
    </div>
    <div class="toast-body">
    <p>Address: ${deliveryAddress}</p>
    <p>Estimated return time: ${returnTime}</p>
    </div>`;
    container.innerHTML += toast;
}