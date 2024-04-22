import os

global BOARD; BOARD = [     # -----------
    [' ', ' ', ' '],        # 3 [X][O][O]  Current player: X
    [' ', ' ', ' '],        # 2 [ ][X][ ]  
    [' ', ' ', ' '],        # 1 [ ][ ][ ]
]                           #    A  B  C
                            # -----------
global CUR_PLY; CUR_PLY = 'X'
global X_LIST; X_LIST = []
global O_LIST; O_LIST = []

# check if a move has won the game
# in: current player, last move, BOARD
# out: True if 3-in-a-row has occured
#      False if move did not win
def winCheck(last_move):
    # n [0,1], e [1,2], s [2,1], w [1,0] -2 vectors
    if last_move == (0,1):          # upper mid
        return lineCheck([0,4])
    elif last_move == (1,2):        # mid right
        return lineCheck([1,5])
    elif last_move == (2,1):        # lower mid
        return lineCheck([2,4])
    elif last_move == (1,0):        # mid left
        return lineCheck([0,1])
    # nw [0,0], ne [0,2], se [2,2], sw [2,0] -3 vectors
    elif last_move == (0,0):        # upper left
        return lineCheck([0,3,6])
    elif last_move == (0,2):        # upper right
        return lineCheck([0,7,5])
    elif last_move == (2,2):        # lower right
        return lineCheck([2,5,6])
    elif last_move == (2,0):        # lower left
        return lineCheck([2,3,7])
    # middle [1,1] -4 vectors
    elif last_move == (1,1):        # mid mid
        return lineCheck([1,4,6,7])
    else:
        print("Couldn't find last move!")
        return True
    
def lineCheck(lines_ind):
    if CUR_PLY == 'X':
        check_list = X_LIST
    else:
        check_list = O_LIST
    win_lines = [
        [(0,0),(0,1),(0,2)],
        [(1,0),(1,1),(1,2)],
        [(2,0),(2,1),(2,2)],
        [(0,0),(1,0),(2,0)],
        [(0,1),(1,1),(2,1)],
        [(0,2),(1,2),(2,2)],
        [(0,0),(1,1),(2,2)],
        [(0,2),(1,1),(2,0)]]
    for ind in lines_ind:
        for nodes in range(len(win_lines[ind])):
            if win_lines[ind][nodes] in check_list:
                if nodes == 2:
                    return True
                else:
                    continue
            else:
                break
    return False

# change current player
# out: change CUR_PLY to next player
def nextPly():
    global CUR_PLY
    if CUR_PLY == 'X':
        CUR_PLY = 'O'
    else:
        CUR_PLY = 'X'

# place a player's symbol in the desired square
# in: current player, {user input}
# out (valid pos): update BOARD and player LIST
# out (invalid pos): prompt user for valid pos
def placeSymbol(pos_yx):
    global BOARD; global CUR_PLY
    if pos_yx == -1:
        return True
    if BOARD[pos_yx[0]][pos_yx[1]] == ' ':
        BOARD[pos_yx[0]][pos_yx[1]] = CUR_PLY
        if CUR_PLY == 'X':
            X_LIST.append(pos_yx)
        else:
            O_LIST.append(pos_yx)
        return False
    else:
        print("invalid position: non-empty")
        return True

# convert user input into coordinates
# in: String user input
# out (valid coord): tuple (row, col)
# out (invalid coord): print error message,
#                      early escape code for place_symbol
def resolveInput(input):
    coord = list(input)
    if len(coord) != 2:
        print("invalid coordinate: not a letter-digit pair")
        return -1
    
    # check digit component
    if '1' in coord:
        out_pos = [2]
    elif '2' in coord:
        out_pos = [1]
    elif '3' in coord:
        out_pos = [0]
    else:
        print("invalid coordinate: missing valid digit")
        return -1
    
    # check letter component
    if 'A' in coord:
        out_pos.append(0)
    elif 'B' in coord:
        out_pos.append(1)
    elif 'C' in coord:
        out_pos.append(2)
    else:
        print("invalid coordinate: missing valid letter")
        return -1
    return tuple(out_pos)

# print the game board, current player
def print_game():
    global BOARD; global CUR_PLY
    print("-----------")
    firstRow = True
    row_c = 3           # row numbering var
    for row in BOARD:
        print(str(row_c), end=' ')
        spot_c = 1      # spot counting var
        for spot in row:
            print("[", end='')
            print(spot, end='')
            if spot_c != len(row):  # print w/o line jump until last spot
                print("]", end='')
            spot_c += 1
        if row_c == 3:  # print only after first row
            print("]  Current player:", CUR_PLY)
        else:
            print("]")  # close last spot
        row_c -= 1
    print("   A  B  C")
    print("-----------")

def main():
    global BOARD; global CUR_PLY
    os.system('cls')
    print("\n+----- Tic Tac Toe -----+")
    print("+- Three in a row wins -+\n")
    print_game()
    wait_move = True
    no_winner = True
    moves = 0
    while(no_winner):
        moves += 1
        while(wait_move):
            user_in = input("Choose a position!: ")
            user_move = resolveInput(str(user_in).upper())
            wait_move = placeSymbol(user_move)
        if moves > 4 and winCheck(user_move):
            no_winner = False        
        elif moves < 9:
            nextPly()
            wait_move = True
        else:
            print_game()
            break
        print_game()
    print("-Game Over-")
    if no_winner:
        print("It's a tie!")
    else:
        print(" Winner:", CUR_PLY)
    print("-----------")
    print()

if __name__ == "__main__":
    main()