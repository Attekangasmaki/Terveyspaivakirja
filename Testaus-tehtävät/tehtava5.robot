*** Settings ***
Library     Browser    auto_closing_level=KEEP
Library     Collections
Library     OperatingSystem
Library     dotenv    # Lisää dotenv-kirjasto ympäristömuuttujien lataamiseen
Resource    Keywords.robot 
Library           Collections
Variables         load_env.py 

*** Test Cases ***
Test Login Page
    ${Username}    Set Variable    %{USERNAME}
    ${Password}    Set Variable    %{PASSWORD}
    
    New Browser    chromium    headless=No  
    New Page       http://localhost:5173/src/pages/login.html
    Get Title      ==    Kirjaudu sisään  
    Type Text      [name="username"]        ${Username}    delay=0.1 s 
    Type Text      [name="password"]        ${Password}    delay=0.1 s
    Click With Options    css=.login-button    delay=2 s
    Get Text       id=loginResponse    !=    Virheellinen käyttäjätunnus tai salasana