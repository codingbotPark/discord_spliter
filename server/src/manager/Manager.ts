import { Express } from "express";
import { Employee } from "../util/Logger";

// Manager interface role = manager's 
export interface Manager{
    manage(app:Express):void
}

export type EmployedManagerType = Employee & Manager