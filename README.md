# worthit.goals.cash
 
Calculate if your goals are worth splurging your cash on! 

> NOTE: This is a vibe-coded project using <https://lovable.dev>
>       the prompt used for it is available below 



## PROMPT 

Make an app called "worth it" that calculates if an expense you're going to make is worth it or not.

There are 3 stages

- enter income details
- enter a goal
- see the score

## Income Details.

Enter the following details :

- What is your monthly income. (enter amount, pick currency - top global currencies USD, EUR, GBP, INR)
- What % of it do you save
- How many hours/day you work (default 8)
- How many days/week you work (default 5)

Store the input (localStorage) so the input values are saved. User can resubmit, but not required if saved.

After entering this data, show

    savings/year (monthly * 12)
    savings/month
    savings/week (annual / 52)
    savings/day (weekly / nDays)
    savings/hour (daily / nHours)

## Enter a Goal

- Name of Goal (eg: Buy an iPhone, Go for Bali Vacation)
- How much will it cost? 
- Is this a product or experience?
  - if product: 
	  - how many years will this last (slider; default 5; max 50)
	  - how much do you want it: name: impact; 4-point slider 
		  - 1 - nice to have 
		  - 2 - really useful 
		  - 3 - need it badly 
		  - 4 - dying for it 
  - if experience: 
	  - how long will you remember (slider: default 20 years; max 50)
	  - how much will you love the experience name: impact; 4-point slider
		  - 1 - enjoy it 
		  - 2 - remember it fondly 
		  - 3 - cherish the memory
		  - 4 - once in a lifetime 

Once a goal data is entered, save it, in an array and into localstorage
So that all past filled goals can be seen. 

## Goal Score Screen 

Show in terms of savings, how long it takes to save for this goal 
 - in number of hours
 - in number of days
 - in number of weeks
 - in number of months 
 - in number of years

Goal score is calculated using the following values. 

```
expToCostRatio = goal experience years / goal cost in years

goalScore =  expToCostRatio * impact 

// cutoff values > 100 
goalScore = max(100, goalScore) 
```

Based on goalScore, show a big result, as per follows 

1. 0-50: "Worthless 😞" 
2. 50-75: "Whatever 😶" 
3. 75-95: "Worth it 😁"
4. 95-100: "Just do it! 😱" 

Show the result of the most recent calculation in a big card, and below that a table of all previously calculated goals.

