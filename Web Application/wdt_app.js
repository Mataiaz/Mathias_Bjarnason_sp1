const staffTable = document.getElementById("staffTable");
const scheduleTable = document.getElementById("scheduleTable");
const deliveryTable = document.getElementById("deliveryTable");

Load();

async function Load() {
    $('#navBar #dropMenu').hide();

    loadTableData();
    displayTime();
}

//Initial API request for populating the the staff table
async function getDemoStaff(amount) {
    const items = [];
    while (amount > 0) {
        amount--;
        await fetch('https://randomuser.me/api/')
            .then((response) => response.json())
            .then((response) => items[amount] = response)
            .finally((items) => { return items });
    }
    return items;
}
//Populate table with data from the api request
async function loadTableData() {
    items = await getDemoStaff(5);
    console.log(items);
    items.forEach(item => {
        //new StaffMember('<img src="' + item.results[0].picture.thumbnail + '" />', item.results[0].email, "", "", "", "")
        let row = staffTable.insertRow();
        let picture = row.insertCell(0);
        picture.innerHTML = '<img src="' + item.results[0].picture.thumbnail + '" />';
        let name = row.insertCell(1);
        name.innerHTML = item.results[0].name.first;
        let surName = row.insertCell(2);
        surName.innerHTML = item.results[0].name.last;
        let email = row.insertCell(3);
        email.innerHTML = item.results[0].email;
        let status = row.insertCell(4);
        let outTime = row.insertCell(5);
        let duration = row.insertCell(6);
        let returnTime = row.insertCell(7);
    });
}

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
    constructor (picture, email, status, outTime, duration, expectedReturnTime)
    {
        this.picture = picture;
        this.email = email;
        this.status = status;
        this.outTime = outTime;
        this.duration = duration;
        this.expectedReturnTime = expectedReturnTime;
    }
    //Get the staff members info
    getStaffMember() {
        Employ.getEmployNames;
    }
    //Notify user if staff member is late with toast
    staffMemberIsLate() {
        
    }
}

//Delivery driver
class DeliveryDriver extends Employee {
    vehicle;
    telephone;
    deliveryAddress;
    returnTime;
    constructor (vehicle, telephone, deliveryAddress, returnTime)
    {
        this.vehicle = vehicle;
        this.telephone = telephone;
        this.deliveryAddress = deliveryAddress;
        this.returnTime = returnTime;
    }
    //Get the delivery driver info
    getDelivery() {
        Employ.getEmployNames;
    }
    //Notify user if delivery driver is late with toast
    deliveryDriverIsLate() {
    }
}

function displayTime() {
    var d = new Date();
    var day = d.getDate();
    var month = d.getMonth() + 1;
    var year = d.getFullYear();
    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    document.getElementById("clock").innerHTML = day + " " + month +" "+ year + " " + hour + ":" + min + ":" + sec;
    setInterval(displayTime, 1000);
    
}

function getCurrentTime() {
   
}


$('#deliveryBtn').on('click', () => {
    try {
        let i = 0;
        const order = [];
        while (i < 6) {
            if (scheduleTable.getElementsByTagName("input")[i].value.length < 1) {
                alert("You are missing a field");
                break;
            }
            if (scheduleTable.getElementsByTagName("input")[i].value.length > 99) {
                alert("The fields have a text limit of 100");
                break;
            }
            if (scheduleTable.getElementsByTagName("input")[3].value.length > 15 || scheduleTable.getElementsByTagName("input")[3].value.length < 7) {
                alert("Not a valid phone number");
                break;
            }
            if (scheduleTable.getElementsByTagName("input")[5].value.length > 4) {
                alert("Not a valid time");
                break;
            }
            order[i] = scheduleTable.getElementsByTagName("input")[i].value;
            i++;
        }
        if (i == 6) {
            let row = deliveryTable.insertRow();
            let vehicle = row.insertCell(0);
            vehicle.innerHTML = order[0];
            let name = row.insertCell(1);
            name.innerHTML = order[1];
            let surName = row.insertCell(2);
            surName.innerHTML = order[3];
            let telephone = row.insertCell(3);
            telephone.innerHTML = order[4];
            let deliveryAddress = row.insertCell(4);
            deliveryAddress.innerHTML = order[4];
            let returnTime = row.insertCell(5);
            returnTime.innerHTML = order[5];
        }
        while (i > 0) {
            i--;
            $(scheduleTable.querySelectorAll("input")[i].value = "");
        }
    } catch (error) {
        console.log(error);
    }
})

$('#deliveryTable').on('click', 'tr:not(:first-child)', function(){
    let rows = Array.from(document.querySelectorAll('tr'));
    rows.forEach(node => {
        node.classList.remove('toDelete');
      });
    $(rows).css('background', 'white');
    $(this).css('background', 'red');
    $(this).addClass("toDelete");
    console.log(this);
});

$('#clearBtn').on('click', () => {
    const toDelete = document.getElementsByClassName("toDelete");
    let rows = Array.from(document.querySelectorAll('#deliveryTable tr:not(:first-child)'));
    $(toDelete).remove();
    rows.forEach(node => {
        node.classList.remove('marked');
      });
    $(rows).css('background', 'white');
    
})

$('#staffTable').on('click', 'tr:not(:first-child)', function(){
    
    let rows = Array.from(document.querySelectorAll('tr'));
    rows.forEach(node => {
        node.classList.remove('marked');
      });
    $(rows).css('background', 'white');
    $(this).css('background', 'red');
    $(this).addClass("marked");
    
});

$('#inBtn').on('click', () => {
    const marked = document.getElementsByClassName("marked");
    let rows = Array.from(document.querySelectorAll('tr'));
    $(marked).find('td:eq(4)').html('In');
    $(marked).find('td:eq(5)').html('');
    $(marked).find('td:eq(6)').html('');
    $(marked).find('td:eq(7)').html('');
    rows.forEach(node => {
        node.classList.remove('marked');
      });
    $(rows).css('background', 'white');
})

$('#outBtn').on('click', () => {
    const marked = document.getElementsByClassName("marked");
    let rows = Array.from(document.querySelectorAll('tr'));
    var time = prompt("Please enter a time");
    var d = new Date();
    var hour = d.getHours();
    var min = d.getMinutes();
    if(!Number.isNaN(time) && time.length < 5)
    {
        $(marked).find('td:eq(4)').html('Out');
        $(marked).find('td:eq(5)').html(hour + ":" + min);
        var hours = Math.floor(time / 60);  
        var minutes = time % 60;
        $(marked).find('td:eq(6)').html(hours + "hrs " + minutes + "min");
        const returnDate = new Date();
        hour += hours;
        min += minutes;
        $(marked).find('td:eq(7)').html(hour + ":" + min);
    }
    else {
        alert("Invalid time")
    }
    rows.forEach(node => {
        node.classList.remove('marked');
      });
    $(rows).css('background', 'white');
})

var change = 0;
$('#navBar').hover(() => {
    if (change == 0) {
        $('#navBar #dropMenu').hide();
        change++;
    }
    else {
        change = 0;
        $('#navBar #dropMenu').show();
    }
});