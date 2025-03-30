*** Settings ***
Library     Browser    auto_closing_level=KEEP
Resource    Keywords.robot  

*** Test Cases ***
Test Login Page
    New Browser    chromium    headless=No  
    New Page       http://localhost:5173/src/pages/login.html
    Get Title      ==    Kirjaudu sisään  
    Type Text      [name="username"]        ${Username}    delay=0.1 s 
    Type Text      [name="password"]        ${Password}    delay=0.1 s
    Click With Options    css=.login-button    delay=2 s
    Get Text       id=loginResponse    !=    Virheellinen käyttäjätunnus tai salasana