import { Request, Response } from "express";
import baseRepository from "../repo/baseRepo";
import common from "../common/common";
import axios from "axios";
import ResponseMessages from "../common/responseMessages"
import { googleApiKey } from "../utils/constants";

export const searchAddress = async (req: Request, res: Response) => {
  try {
    const { input } = req.query;

    if (!input) {
        return res.status(400).json({ message: 'Input is required' });
    }
  
    
        // First request to get autocomplete suggestions
        const autocompleteResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/autocomplete/json`, {
          params: {
            input,
            key: googleApiKey,
            // components: 'country:IN' 
  
          }
        });


      
        const placeId = autocompleteResponse.data.predictions[0].place_id;
    
        // Second request to get place details
        const detailsResponse = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json`, {
          params: {
            place_id: placeId,
            key: googleApiKey
          }
        });
    
        const result = detailsResponse.data.result;
        const location = result.geometry.location;
        const addressComponents = result.address_components;
    
        // Extracting the required details
        let street = '';
        let area = '';
        let city = '';
        let state = '';
        let pincode = '';
        let landmark='';
        let phoneNumber = result.formatted_phone_number ? result.formatted_phone_number.replace(/\s+/g, '') : ''; // Remove spaces
  
        addressComponents.forEach((component:any) => {
          const types = component.types;
          if (types.includes('street_number')) {
            street = component.long_name;
          }
          if (types.includes('route')) {
            street += ` ${component.long_name}`;
          }
          if (types.includes('sublocality_level_1') || types.includes('neighborhood')) {
            area = component.long_name;
          }
          if (types.includes('locality')) {
            city = component.long_name;
          }
          if (types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
          if (types.includes('postal_code')) {
            pincode = component.long_name;
          }
          if (types.includes('point_of_interest') || types.includes('establishment')) {
            landmark = component.long_name; // This may give you multiple landmarks; adjust accordingly
          }
        });
    
        const response = {
          lat: location.lat,
          lng: location.lng,
          street,
          area,
          city,
          state,
          pincode,
          landmark,
          phoneNumber 
        };
  let responseObj={
      prediction:autocompleteResponse.data.predictions,
      location:response
  
  }
        return ResponseMessages.Response(res, "Data fetch successfully",responseObj);
    
     

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};