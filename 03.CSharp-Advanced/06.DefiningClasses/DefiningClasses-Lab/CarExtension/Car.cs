﻿using System;
using System.Text;

namespace CarManufacturer
{
    public class Car
    {
        private string make;
        private string model;
        private int year;
        private double fuelQuantity;
        private double fuelConsumption;

        public string Make
        {
            get { return make; }
            set { make = value; }
        }

        public string Model
        {
            get { return model; }
            set { model = value; }
        }

        public int Year
        {
            get { return year; }
            set { year = value; }
        }

        public double FuelQuantity
        {
            get { return fuelQuantity; }
            set { fuelQuantity = value; }
        }

        public double FuelConsumption
        {
            get { return fuelConsumption; }
            set { fuelConsumption = value; }
        }

        public void Drive(double distance)
        {
            double fuelLeft = fuelQuantity - (distance * fuelConsumption);

            if (fuelLeft < 0)
            {
                Console.WriteLine($"Not enough fuel to perform this trip!");
                return;
            }

            fuelQuantity = fuelLeft;
        }

        public string WhoAmI()
        {
            StringBuilder toPrint = new StringBuilder();

            toPrint.Append($"Make: {this.Make}\n");
            toPrint.Append($"Model: {this.Model}\n");
            toPrint.Append($"Year: {this.Year}\n");
            toPrint.Append($"Fuel: {this.FuelQuantity:f2}");

            return toPrint.ToString();
        }
    }
}