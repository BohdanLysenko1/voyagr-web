declare module 'amadeus' {
  interface AmadeusConfig {
    clientId: string;
    clientSecret: string;
    hostname?: string;
  }

  interface AmadeusResponse {
    data: any;
    result: any;
  }

  class Amadeus {
    constructor(config: AmadeusConfig);
    shopping: {
      flightOffersSearch: {
        get(params: any): Promise<AmadeusResponse>;
      };
    };
    referenceData: {
      locations: {
        get(params: any): Promise<AmadeusResponse>;
      };
    };
  }

  export default Amadeus;
}
