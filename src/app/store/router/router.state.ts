import {Data, Params} from '@angular/router';


export interface RouterStateUrl {
  url: string;
  params: Params;
  queryParams: Params;
  fragment: string | null;
  data: Data;
}