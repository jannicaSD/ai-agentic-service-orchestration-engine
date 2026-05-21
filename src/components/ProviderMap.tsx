import { MapPin } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { colors } from '../theme/colors';
import { Provider } from '../types';

interface ProviderMapProps {
  providers: Provider[];
  initialRegion?: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  };
}

const darkMapStyle = [
  {
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#121A2B" // Card color
      }
    ]
  },
  {
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#94A3B8"
      }
    ]
  },
  {
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#1A365D"
      }
    ]
  },
  {
    "featureType": "administrative.locality",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#F8FAFC"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#F8FAFC"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0B1020" // Background color
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#4F8CFF"
      },
      {
        "lightness": -40
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#0B1020"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#7B61FF"
      },
      {
        "lightness": -30
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#0B1020"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#0B1020"
      }
    ]
  }
];

export const ProviderMap = ({ 
  providers,
  initialRegion = {
    latitude: 33.6491, // Islamabad roughly
    longitude: 72.9750,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  }
}: ProviderMapProps) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.container, styles.webFallback]}>
        {providers.map((provider) => (
          <View key={provider.id} style={styles.webMarker} />
        ))}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        // provider={PROVIDER_GOOGLE} - uncomment when API key added
        style={styles.map}
        initialRegion={initialRegion}
        customMapStyle={darkMapStyle}
        showsUserLocation={true}
        showsMyLocationButton={false}
        showsCompass={false}
      >
        {providers.map((provider) => (
          <Marker
            key={provider.id}
            coordinate={{
              latitude: provider.location.latitude,
              longitude: provider.location.longitude,
            }}
            title={provider.name}
            description={`${provider.serviceCategory} • PKR ${provider.hourlyRate}/hr`}
          >
            <View className="bg-primary/20 p-2 rounded-full border border-primary">
              <MapPin size={20} color={colors.primary} fill={colors.background} />
            </View>
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    width: '100%',
    overflow: 'hidden',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  webFallback: {
    backgroundColor: '#0B1020',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webMarker: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: colors.primary,
    margin: 3,
  },
});