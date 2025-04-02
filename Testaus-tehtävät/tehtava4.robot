*** Settings ***
Library    Browser    auto_closing_level=KEEP
Library    BuiltIn

*** Variables ***
${USERINFO_URL}    http://localhost:5173/src/pages/userinfo.html

&{DIARY_ENTRY}    
...    date=2025-03-25    
...    mood=ilo    
...    weight=70.5    
...    sleep_hours=8    
...    notes=Testimerkintä

*** Test Cases ***
Add Diary Entry 
    # Avaa selain
    New Browser    chromium    headless=No
    
    # Siirry suoraan käyttäjän tietosivulle
    New Page    ${USERINFO_URL}
    
    # Odota pääsivun latautumista
    Wait For Elements State    css=button[onclick="addEntry()"]    visible    timeout=15s
    
    # Avaa päiväkirjamerkinnän lisäysdialogi
    Click    css=button[onclick="addEntry()"]
    
    # Odota dialogin aukeamista
    Wait For Elements State    css=dialog#myDialog    visible    timeout=10s
    
    # Täytä lomake
    Select Options By    css=select#mood    value    ilo
    Type Text    css=input[type="date"]    ${DIARY_ENTRY['date']}
    Type Text    css=input#weight    ${DIARY_ENTRY['weight']}
    Type Text    css=input#sleep_hours    ${DIARY_ENTRY['sleep_hours']}
    Type Text    css=textarea#notes    ${DIARY_ENTRY['notes']}
    
    # Lähetä merkintä
    Click    css=button[onclick="submitEntry()"]

    
    # Sulje selain
    Close Browser
