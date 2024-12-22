import { Account, Client } from 'appwrite';
import { environment } from '../environments/environment';

export const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1')
  .setProject(environment.appwrite.projectId);

export const account = new Account(client);
export { ID } from 'appwrite';
