import { client } from "./client";

export interface teacher extends client{
    title: string;
    biography: string;
}