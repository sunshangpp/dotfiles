set -xg fish_color_user FE642E
set -xg fish_color_host FACC2E
set -xg fish_color_cwd 58FAAC

function fish_prompt --description 'Write out the prompt'
	set -l last_status $status

  # User
  set_color $fish_color_user
  echo -n (whoami)
  set_color 848484

  echo -n ' at '

  # Host
  set_color $fish_color_host
  echo -n (hostname -s)
  set_color 848484

  echo -n ' in '

  # PWD
  set_color $fish_color_cwd
  echo -n (prompt_pwd)
  set_color 848484

  echo -n ' '

  # GIT
  __terlar_git_prompt
  echo

  if not test $last_status -eq 0
    set_color $fish_color_error
  end

  set_color cyan
  echo -n '➤ '
  set_color normal
end
