var year = 0
var sendData

$(document).ready(function() {

  getData()
  $('body').append("<div id=container></div>")
  $('#container').append("<button id=save value=save onclick=save()>save")
  $('#container').append("<table id=table></table>")
  $('#container').append("<div id=chart></div>")



});

function save() {
  $.ajax({
      url: 'fillJson.php',
      type: 'POST',
      data: {
        sendData: sendData
      }
    })
    .done(function(result) {
      console.log("success");
    })
    .fail(function(result) {
      console.log("error");
    })
    .always(function(result) {
      console.log("complete");
    });
}




function getData() {
  $.ajax({
      url: 'humans.json',
      type: 'GET',
      dataType: 'json'
    })
    .done(function() {
      console.log("success");
    })
    .fail(function(result) {
      console.log("error");
    })
    .always(function(result) {
      console.log("complete");
      build(result)
      setInterval(takeTurn, 1000)
      setInterval(match, 500)
    });

}

function showData(res) {
  $('#table').append("<tr><td>id<td>sex<td>age<td>murderer<td>dead<td>pregnant</tr>")
  for (var i = 0; i < res.length; i++) {
    $('#table').append("<tr><td>" + res[i]["id"] + "</td><td>" + res[i]["sex"] + "</td><td>" + res[i]["age"] + "</td><td>" + res[i]["murderer"] + "</td><td>" + res[i]["dead"] + "</td><td>" + res[i]["pregnant"] + "")
  }
}

function build(res) {
  console.log(res);
  showData(res)
  sendData = res

}

function takeTurn() {
  year += 0.1
  // console.log(Math.round(year * 10 ) / 10);

  for (var i = 0; i < sendData.length; i++) {
    if (sendData[i]["dead"] == "yes") {
      sendData.splice(i, 1)
    }

    if ((Math.round(year * 10) / 10) % 1 === 0) {
      if (sendData[i]["dead"] == "yes") {

      } else {
        sendData[i]["age"] = Number(sendData[i]["age"]) + 1
      }
    }
    if (sendData[i]["pregnantEnd"] == (Math.round(year * 10) / 10)) {
      sendData[i]["pregnant"] = "no"
      birth()
    }
    if (Math.floor(Math.random() * (Number(sendData[i]["age"]) * 1.5)) > 85) {
      death(sendData[i]["id"])
    }
  }
  $('#table').empty()
  showData(sendData)

  male = []
  female = []

  for (var i = 0; i < sendData.length; i++) {
    if (sendData[i]["sex"] == "male") {
      male.push(sendData[i])
    } else {
      female.push(sendData[i])
    }

  }

  updateChart(male, female)
}

function match() {
  var random = Math.floor(Math.random() * sendData.length)
  var random2 = Math.floor(Math.random() * sendData.length)

  if (sendData[random]["id"] != sendData[random2]["id"]) {
    if (sendData[random]["dead"] != "yes" && sendData[random2]["dead"] != "yes") {

      if (sendData[random]["sex"] == "female" && sendData[random2]["sex"] == "male") {

        if (sendData[random]["age"] > 15 && sendData[random]["age"] < 46 && sendData[random2]["age"] > 15 && sendData[random2]["age"] < 46) {

          if (sendData[random]["pregnant"] == "no") {
            if (sendData[random]["sex"] == "female") {

                  var chance = Math.floor(Math.random() * 100)
                  if (chance > 45) {
                    sendData[random]["pregnant"] = "yes"
                    sendData[random]["pregnantStart"] = Math.round(year * 10) / 10
                    sendData[random]["pregnantEnd"] = Math.round((year + 0.7) * 10) / 10
                  }
                }
            }
          }
        }
      }
    }
  }


function birth() {
  id = sendData.length
  age = 0
  chance = Math.floor(Math.random() * 100)
  if (chance < 50) {
    sex = "male"
  } else {
    sex = "female"
  }
  sendData.push({
    "id": id,
    "sex": sex,
    "age": age,
    "murderer": "no",
    "dead": "no",
    "pregnant": "no",
    "pregnantStart": "integer"
  })
}

function death(id) {
  sendData[id]["dead"] = "yes"
}

function updateChart(male, female) {
  chart = document.getElementById('chart')

  maleAge = []

  for (var i = 0; i < male.length; i++) {
    maleAge.push(male[i]["age"])
  }

  var maleGraph = {
    y: maleAge,
    type: "bar"
  }

  femaleAge = []

  for (var i = 0; i < female.length; i++) {
    femaleAge.push(female[i]["age"])
  }

  var femaleGraph = {
    y: femaleAge,
    type: "bar"
  }

  var data = [maleGraph, femaleGraph];

  var layout = {barmode: 'group'};

  Plotly.newPlot(chart, data, layout)
}
