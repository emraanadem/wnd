import sys
import os
import io
import json
import folium
import psutil
import logging
from PyQt5.QtGui     import *
from PyQt5.QtCore    import *
from PyQt5.QtWidgets import *
from folium.plugins import MousePosition
from PyQt5.QtWidgets import QApplication, QWidget, QHBoxLayout, QVBoxLayout, QInputDialog, QLabel, QPushButton
from PyQt5.QtWebEngineWidgets import QWebEngineView
from geopy.geocoders import Nominatim
from PyQt5.QtCore import pyqtSlot

geolocator = Nominatim(user_agent="MyApp")

class HyperLink(QLabel):
    def __init__(self, parent = None):
        super().__init__()
        self.setOpenExternalLinks(True)
        self.setParent(parent)

class InteractiveMap(QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle('WhosNextDoor')
        cityy = QInputDialog
        text = cityy.getText(self, 'University Location', 'Hello! Where is your University Located?')[0].strip()
        cityy.resize(self, 500, 300)
        with open('city.json', 'w+') as file:
            city = {}
            city['city'] = text
            file.write(json.dumps(city))
        InteractiveMap.start(self)

    def start(self):
        os.system('node wnd.js')
        f = open('data.json')
        data = json.load(f)
        layout = QVBoxLayout()
        coordinate = (geolocator.geocode(data[0]).latitude, geolocator.geocode(data[0]).longitude)
        m = folium.Map(
        	tiles='OpenStreetMap',
        	zoom_start=13,
        	location=coordinate
        )
        # Iterating through the json
        # list
        list = []
        for i in range(1, len(data)):
            if '--' not in data[i][6]:
                url = "<a href ={0} target = '_self'>More Info</a>".format(str(data[i][6]))
                if ('None' not in str(data[i][1]) and 'None' not in str(data[i][2])):
                    tag = str(data[i][0]) + '\n' + 'Price: $' + str(data[i][3])
                    if 'None' in tag and 'None' in str(data[i][5]):
                        tag = str(data[i][0]) + '\n' + 'Price:' + ' Contact for Pricing'
                        data[i][4][0] = 'Price: ' + 'Contact for Pricing' + '\nBedrooms: ' + 'Contact for Bedrooms'
                    elif 'None' in str(data[i][5]):
                        data[i][4][0] = 'Price: $' + str(data[i][3]) + '\nBedrooms: ' + 'Contact for Bedrooms'
                    elif 'None' in tag:
                        tag = str(data[i][0]) + '\n' + 'Price:' + ' Contact for Pricing'
                folium.CircleMarker(
                    location=(float(data[i][1]), float(data[i][2])),
                    popup=folium.Popup(url),
                    tooltip = tag,
                    radius = 4,
                    fill=True, # Set fill to True
                    color = 'blue',
                    fill_opacity=1
                ).add_to(m)
            else:
                if ('None' not in str(data[i][1]) and 'None' not in str(data[i][2])):
                    tag = str(data[i][0]) + '\n' + 'Price: $' + str(data[i][3])
                    if 'None' in tag and 'None' in str(data[i][5]):
                        tag = str(data[i][0]) + '\n' + 'Price:' + ' Contact for Pricing'
                        data[i][4][0] = 'Price: ' + 'Contact for Pricing' + '\nBedrooms: ' + 'Contact for Bedrooms'
                    elif 'None' in str(data[i][5]):
                        data[i][4][0] = 'Price: $' + str(data[i][3]) + '\nBedrooms: ' + 'Contact for Bedrooms'
                    elif 'None' in tag:
                        tag = str(data[i][0]) + '\n' + 'Price:' + ' Contact for Pricing'
                folium.CircleMarker(
                    location=(float(data[i][1]), float(data[i][2])),
                    popup=folium.Popup(data[i][4][0]),
                    tooltip = tag,
                    radius = 4,
                    fill=True, # Set fill to True
                    color = 'blue',
                    fill_opacity=1
                ).add_to(m)

        # Closing file
        f.close()
        formatter = "function(num) {return L.Util.formatNum(num, 3) + ' º ';};"
        MousePosition(
            position="topleft",
            separator=" | ",
            empty_string="NaN",
            lng_first=True,
            num_digits=20,
            prefix="Coordinates:",
            lat_formatter=formatter,
            lng_formatter=formatter,
        ).add_to(m)
        # save map data to data object
        data = io.BytesIO()
        m.save(data, close_file=False)
        webView = QWebEngineView()
        webView.setHtml(data.getvalue().decode())
        layout.addWidget(webView)
        buttonChangeLoc = QPushButton('Change Location', self)
        buttonChangeLoc.clicked.connect(self.restart)
        self.setLayout(layout)
        layout.addWidget(buttonChangeLoc)
        buttonReturnMap = QPushButton('Return to Map', self)
        buttonReturnMap.clicked.connect(self.returnmap)
        self.setLayout(layout)
        layout.addWidget(buttonReturnMap)

    def returnmap(self):
        try:
            p = psutil.Process(os.getpid())
            for handler in p.get_open_files() + p.connections():
                os.close(handler.fd)
        except Exception as e:
            logging.error(e)
        f = open('data.json')
        data = json.load(f)
        layout = QVBoxLayout()
        coordinate = (geolocator.geocode(data[0]).latitude, geolocator.geocode(data[0]).longitude)
        m = folium.Map(
        	tiles='OpenStreetMap',
        	zoom_start=13,
        	location=coordinate
        )
        # Iterating through the json
        # list
        list = []
        for i in range(1, len(data)):
            if '--' not in data[i][6]:
                url = "<a href ={0} target = '_self'>More Info</a>".format(str(data[i][6]))
                if ('None' not in str(data[i][1]) and 'None' not in str(data[i][2])):
                    tag = str(data[i][0]) + '\n' + 'Price: $' + str(data[i][3])
                    if 'None' in tag and 'None' in str(data[i][5]):
                        tag = str(data[i][0]) + '\n' + 'Price:' + ' Contact for Pricing'
                        data[i][4][0] = 'Price: ' + 'Contact for Pricing' + '\nBedrooms: ' + 'Contact for Bedrooms'
                    elif 'None' in str(data[i][5]):
                        data[i][4][0] = 'Price: $' + str(data[i][3]) + '\nBedrooms: ' + 'Contact for Bedrooms'
                    elif 'None' in tag:
                        tag = str(data[i][0]) + '\n' + 'Price:' + ' Contact for Pricing'
                folium.CircleMarker(
                    location=(float(data[i][1]), float(data[i][2])),
                    popup=folium.Popup(url),
                    tooltip = tag,
                    radius = 4,
                    fill=True, # Set fill to True
                    color = 'blue',
                    fill_opacity=1
                ).add_to(m)
            else:
                if ('None' not in str(data[i][1]) and 'None' not in str(data[i][2])):
                    tag = str(data[i][0]) + '\n' + 'Price: $' + str(data[i][3])
                    if 'None' in tag and 'None' in str(data[i][5]):
                        tag = str(data[i][0]) + '\n' + 'Price:' + ' Contact for Pricing'
                        data[i][4][0] = 'Price: ' + 'Contact for Pricing' + '\nBedrooms: ' + 'Contact for Bedrooms'
                    elif 'None' in str(data[i][5]):
                        data[i][4][0] = 'Price: $' + str(data[i][3]) + '\nBedrooms: ' + 'Contact for Bedrooms'
                    elif 'None' in tag:
                        tag = str(data[i][0]) + '\n' + 'Price:' + ' Contact for Pricing'
                folium.CircleMarker(
                    location=(float(data[i][1]), float(data[i][2])),
                    popup=folium.Popup(data[i][4][0]),
                    tooltip = tag,
                    radius = 4,
                    fill=True, # Set fill to True
                    color = 'blue',
                    fill_opacity=1
                ).add_to(m)

        # Closing file
        f.close()
        formatter = "function(num) {return L.Util.formatNum(num, 3) + ' º ';};"
        MousePosition(
            position="topleft",
            separator=" | ",
            empty_string="NaN",
            lng_first=True,
            num_digits=20,
            prefix="Coordinates:",
            lat_formatter=formatter,
            lng_formatter=formatter,
        ).add_to(m)
        # save map data to data object
        data = io.BytesIO()
        m.save(data, close_file=False)
        webView = QWebEngineView()
        webView.setHtml(data.getvalue().decode())
        layout.addWidget(webView)
        pass

    def restart(self):
        try:
            p = psutil.Process(os.getpid())
            for handler in p.get_open_files() + p.connections():
                os.close(handler.fd)
        except Exception as e:
            logging.error(e)

        python = sys.executable
        os.execl(python, python, *sys.argv)

if __name__ == '__main__':
    app = QApplication(sys.argv)
    app.setStyleSheet('''
        QWidget {
            font-size: 35px;
        }
    ''')
    
    InteractiveMap = InteractiveMap()
    InteractiveMap.show()
    

    try:
        sys.exit(app.exec_())
    except SystemExit:
        print('Closing Window...')